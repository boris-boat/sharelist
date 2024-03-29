import React, { useState } from "react";
import "./SettingsModalStyles.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { setIsOpen } from "@/redux/modalSlice";
import { pb } from "@/lib/pb";
import { getGroups, setCurrentGroup } from "@/redux/groupSlice";

export const SettingsModal = () => {
  const [groupSettingsData, setGroupSettingsData] = useState({
    newGroupTitle: "",
    newUserID: "",
    groupIdToDelete: "",
  });
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const user = useSelector((state) => state.user.userData);
  const userGroups = useSelector((state) => state.group.userGroups);
  const currentGroup = useSelector((state) => state.group.currentGroup);
  const handleCreateGroup = async () => {
    const newGroupTitle = groupSettingsData.newGroupTitle;
    if (newGroupTitle) {
      try {
        await pb
          .collection("listGroups")
          .create({
            title: newGroupTitle,
            lists: [],
            creator: user?.record?.username,
            usersParticipating: [user?.record?.id],
          })
          .then(() => dispatch(getGroups()));
        setGroupSettingsData((prev) => ({
          ...prev,
          newGroupTitle: "",
        }));
      } catch (error) {
        console.error(error);
      }
    } else return;
  };
  const handleAddNewUserToGroup = async () => {
    const newUserId = groupSettingsData.newUserID;
    setGroupSettingsData((prev) => ({
      ...prev,
      newUserID: "",
    }));
    try {
      const userToAdd = await pb
        .collection("users")
        .getFirstListItem(`id = "${newUserId}"`);

      if (userToAdd.id) {
        if (currentGroup.usersParticipating.includes(userToAdd.id)) {
          alert("User already in group!");
          return;
        }
        return pb
          .collection("listGroups")
          .update(currentGroup.id, {
            usersParticipating: [
              ...currentGroup.usersParticipating,
              userToAdd.id,
            ],
          })
          .then((res) => {
            dispatch(setCurrentGroup(res));
          });
      }
    } catch (error) {
      alert("No user");
      return;
    }
  };
  const handleDeleteGroup = async () => {
    let group;
    try {
      group = await pb
        .collection("listGroups")
        .getFirstListItem(`id = "${groupSettingsData.groupIdToDelete}"`);
    } catch (error) {
      alert("Error looking up group id.");
      return;
    }
    if (group?.id && group?.creator === user.record.username) {
      group.lists.forEach(async (list: string) => {
        await pb.collection("list").delete(list);
      });

      await pb
        .collection("listGroups")
        .delete(group.id)
        .then(() => dispatch(getGroups()))
        .finally(() => dispatch(setCurrentGroup(undefined)));
    } else {
      alert("Invalid group name or user is not owner");
      return;
    }
    setGroupSettingsData((prev) => ({
      ...prev,
      groupIdToDelete: "",
    }));
  };
  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-5/6 max-w-[700px]">
        <Tabs defaultValue="groups" className="w-1/1">
          <TabsList>
            <TabsTrigger value="groups">Groups Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="groups" className="flex flex-col gap-2">
            <div className="flex justify-between w-1/1">
              <div className="setting-desc">Create new </div>
              <div className="flex grow justify-between">
                <Input
                  type="text"
                  placeholder="New Group Name"
                  className="grow mx-5"
                  value={groupSettingsData.newGroupTitle}
                  onChange={(e) => {
                    setGroupSettingsData((prev) => ({
                      ...prev,
                      newGroupTitle: e.target.value,
                    }));
                  }}
                />
                <Button
                  onClick={() => {
                    handleCreateGroup();
                  }}
                  disabled={groupSettingsData.newGroupTitle === ""}
                >
                  Create
                </Button>
              </div>
            </div>
            {userGroups?.length > 0 &&
            currentGroup?.creator === user.record.username ? (
              <>
                <div className="flex justify-between w-1/1">
                  <div className="setting-desc">
                    Add new user to {currentGroup?.title}
                  </div>
                  <div className="flex grow justify-between">
                    <Input
                      type="text"
                      placeholder="User ID"
                      className="grow mx-5"
                      value={groupSettingsData.newUserID}
                      onChange={(e) => {
                        setGroupSettingsData((prev) => ({
                          ...prev,
                          newUserID: e.target.value,
                        }));
                      }}
                    />
                    <Button
                      onClick={handleAddNewUserToGroup}
                      disabled={groupSettingsData.newUserID === ""}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between w-1/1">
                  <div className="setting-desc">Delete group</div>
                  <div className="flex grow justify-between">
                    <Input
                      type="text"
                      placeholder="Group ID"
                      className="grow mx-5"
                      value={groupSettingsData.groupIdToDelete}
                      onChange={(e) => {
                        setGroupSettingsData((prev) => ({
                          ...prev,
                          groupIdToDelete: e.target.value,
                        }));
                      }}
                    />
                    <Button
                      onClick={handleDeleteGroup}
                      disabled={groupSettingsData.groupIdToDelete === ""}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </TabsContent>
        </Tabs>

        <Button
          type="button"
          variant="secondary"
          onClick={() => dispatch(setIsOpen(false))}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
