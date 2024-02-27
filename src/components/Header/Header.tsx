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
import {
  getGroups,
  setCurrentGroup,
  updateCurrentGroup,
} from "@/redux/groupSlice";
import { getLists } from "@/redux/listsSlice";
import { setIsOpen } from "@/redux/modalSlice";

export const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const userGroups = useSelector((state) => state.group.userGroups);
  const currentGroup = useSelector((state) => state.group.currentGroup);
  const dispatch = useDispatch();

  const updateSelectedGroup = async (e) => {
    await pb.collection("users").update(user?.record?.id, {
      groupSelected: e,
    });
  };
  useEffect(() => {
    const run = async () => {
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
          <SheetContent side={"left"} className="flex flex-col items-center ">
            <SheetHeader>
              <SheetTitle>Hello {user?.record?.username}</SheetTitle>
              <span>User ID : {user?.record?.id}</span>
            </SheetHeader>
            <Select
              onValueChange={async (e) => {
                dispatch(
                  setCurrentGroup(userGroups?.find((group) => group.id === e))
                );
                updateSelectedGroup(e);
              }}
            >
              {userGroups.length === 0 ? (
                <div className="text-center">
                  To select groups , please create group first in the settings
                  menu
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <span>Select group : </span>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={currentGroup?.title} />
                  </SelectTrigger>
                </div>
              )}
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
            <div className="gap-2 flex flex-col mt-5">
              <Button onClick={() => dispatch(setIsOpen(true))}>
                Settings
              </Button>
              <Button
                onClick={() => {
                  pb.authStore.clear();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
};
