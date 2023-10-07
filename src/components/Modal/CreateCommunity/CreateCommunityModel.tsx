import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

import { auth, firestore } from "../../../firebase/clientApp";
import useDirectory from "../../../hooks/useDirectory";
import TagForm from "./hashtag/TagForm";

type CreateCommunityModelProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModel: React.FC<CreateCommunityModelProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [CommunitiesName, setCommunities] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toggleMenuOpen } = useDirectory();
  const bg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("gray.500", "gray.400");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunities(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");

    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(CommunitiesName) || CommunitiesName.length < 3) {
      return setError(
        "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
      );
    }

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", CommunitiesName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, r/${CommunitiesName} is MdTakeoutDining. Try Another`
          );
          return;
        }

        await transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyTYpe: communityType,
        });

        //update
        updateCommunitySnippet(user?.uid!, transaction);

        // create
        transaction.set(
          doc(
            firestore,
            `users/${user?.uid}/communitySnippets`,
            CommunitiesName
          ),
          {
            communityId: CommunitiesName,
            isModerator: true,
            updateTimeStamp: serverTimestamp() as Timestamp,
          }
        );
      });

      handleClose();
      toggleMenuOpen();
      setCommunityType("");
      setCommunities("");
      router.push(`r/${CommunitiesName}`);
    } catch (error: any) {
      console.log("HandleCreateCommunity Error", error);
      setError(error.message);
    }

    setLoading(false);
    //setError("")
  };

  const updateCommunitySnippet = async (userId: string, transaction: any) => {
    if (!userId) return;

    const communityUpdateDocRef = doc(
      firestore,
      `communities/${CommunitiesName}/userInCommunity/${userId}`
    );

    await transaction.set(communityUpdateDocRef, {
      userId: userId,
      userEmail: user?.email,
    });
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a Community
          </ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <div className='container flex items-center h-full max-w-3xl mx-auto'>
                <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
                  <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-semibold'>Create a Community</h1>
                  </div>

                  <hr className='bg-red-500 h-px' />

                  <div>
                    <h3 className="font-[700] text-[24px] ">Name</h3>
                    <p className='font-[300] text-[14px] pb-2'>
                      Community names including capitalization cannot be changed.
                    </p>
                    <div className='relative'>
                      <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
                      </p>
                      {/* <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-6'
            /> */}
                    </div>
                  </div>
                  <div>

                  </div>
                  <TagForm max={10} message="Input your category content in groups" name="Category" form={"category"}></TagForm>
        <TagForm max={1} message="Hashtag helping people find your group" name="Hashtag" form={"hashtag"}></TagForm>
        
                  <div>
                    <h3 className="font-[700] text-[24px] ">Depcripstion</h3>
                    <p className='font-[300] text-[14px] pb-2'>
                      Decrible your group
                    </p>
                    <div className='relative'>
                      <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
                      </p>
                      {/* <Input
              value={depcriptions}
              onChange={(e) => setDepcriptions(e.target.value)}
              className='pl-6'
            /> */}
                    </div>
                  </div>

                  <div className='flex justify-end gap-4'>
                    
                    {/* <Button
            isLoading={false}
            disabled={input.length === 0}
            onClick={() => createCommunity()}>
            Create Community
          </Button> */}
                  </div>



                </div>
              </div>
            </ModalBody>
          </Box>

          <ModalFooter bg={bg} borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModel;
