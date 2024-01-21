import React, { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { pb } from "@/lib/pb";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { getGroups, setCurrentGroup } from "@/redux/groupSlice";
import { getLists } from "@/redux/listsSlice";

export const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const userGroups = useSelector((state) => state.group.userGroups);
  const currentGroup = useSelector((state) => state.group.currentGroup);
  const dispatch = useDispatch();

  const handleAddNewUserToGroup = async () => {
    const newUserId = prompt("Enter new user id");
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

  useEffect(() => {
    const run = async () => {
      console.log("triggered");
      dispatch(getGroups()).then(() => {
        dispatch(getLists());
      });
    };
    run();
  }, [currentGroup]);

  if (user && userGroups)
    return (
      <div className="w-100 flex content-center pt-4">
        <Sheet>
          <SheetTrigger>
            <RxHamburgerMenu size={25} />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Hello {user?.record?.username}</SheetTitle>
              <span>User ID : {user?.record?.id}</span>
              <Select
                onValueChange={async (e) =>
                  dispatch(
                    setCurrentGroup(userGroups?.find((group) => group.id === e))
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={currentGroup?.title} />
                </SelectTrigger>
                <SelectContent>
                  {userGroups?.map((group) => {
                    return (
                      <SelectItem value={group.id} key={group.title}>
                        {group.title}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button onClick={handleAddNewUserToGroup}>
                Add new user to this group
              </Button>
              {/* <Button
                onClick={() => {
                  pb.authStore.clear();
                  navigate("/");
                }}
              >
                logout
              </Button> */}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    );
};
