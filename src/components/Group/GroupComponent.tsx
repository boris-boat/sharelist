import { getLists, setLists } from "@/redux/listsSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getGroups,
  setCurrentGroup,
  updateCurrentGroup,
} from "@/redux/groupSlice";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { pb } from "@/lib/pb";
export const GroupComponent = () => {
  const user = useSelector((state) => state.user.userData);
  const userGroups = useSelector((state) => state.group.userGroups);
  const lists = useSelector((state) => state.lists.lists);
  const currentGroup = useSelector((state) => state.group.currentGroup);
  const currentGroupIdSelected = useSelector(
    (state) => state.user?.userData?.record?.groupSelected
  );
  const dispatch = useDispatch();
  if (!currentGroup) {
    if (userGroups && currentGroupIdSelected)
      dispatch(
        setCurrentGroup(
          userGroups?.find((group) => group.id === currentGroupIdSelected)
        )
      );
    else if (userGroups && !currentGroupIdSelected) {
      dispatch(setCurrentGroup(userGroups[0]));
    }
  }
  useEffect(() => {
    dispatch(getGroups()).then(() => {
      dispatch(getLists());
    });
  }, [dispatch]);

  const handleAddList = async () => {
    const newTitle = prompt("Please enter new list title");
    if (!newTitle) {
      return;
    }
    try {
      pb.collection("list")
        .create({
          title: newTitle,
          listData: [],
          creator: user?.record?.username,
        })
        .then(async (newList) => {
          const updatedGroup = await pb
            .collection("listGroups")
            .update(currentGroup.id, {
              lists: [...currentGroup.lists, newList.id],
            });
          return updatedGroup;
        })
        .then(async (res) => {
          const updatedLists = await pb.collection("list").getFullList({
            filter: res.lists.map((listId) => `id ~ "${listId}"`).join("||"),
          });
          dispatch(setLists(updatedLists));
          dispatch(updateCurrentGroup(res));
        });
    } catch (error) {
      console.log("[Error creating list] : ", error);
    }
  };

  const deleteList = async (listToDelete) => {
    const res = await pb.collection("list").delete(listToDelete.id);
    if (res) {
      dispatch(getGroups()).then((res) => {
        console.log(res);
        dispatch(updateCurrentGroup(res.payload[0]));
        dispatch(getLists());
      });
    } else return;
  };

  const handleAddNewItem = async (list) => {
    const newListItemText = prompt("Please enter new item text");
    if (!newListItemText) {
      return;
    }
    const newListItem = {
      creator: user?.record.username,
      id: Math.random() + Date.now(),
      text: newListItemText,
    };
    const updatedListData = [...list.listData, newListItem];
    await pb
      .collection("list")
      .update(list.id, {
        listData: updatedListData,
      })
      .then(() => {
        dispatch(getLists());
      })
      .catch((e) => console.log(e));
  };

  const handleEditListItem = async (item, list) => {
    const newListItemText = prompt("Please enter new item text", item.text);
    if (!newListItemText) {
      return;
    }
    const updatedListItem = {
      ...item,
      text: newListItemText,
    };
    const updatedListData = [
      ...list.listData.map((currentItem) =>
        currentItem.id === item.id ? updatedListItem : currentItem
      ),
    ];
    let res = await pb.collection("list").update(list.id, {
      listData: updatedListData,
    });
    dispatch(getLists());
  };

  const handleDeleteListItem = async (itemToDelete, list) => {
    const updatedListData = [
      ...list.listData.filter(
        (currentItem) => currentItem.id !== itemToDelete.id
      ),
    ];
    await pb
      .collection("list")
      .update(list.id, {
        listData: updatedListData,
      })
      .then(() => {
        dispatch(getLists());
      });
  };

  return (
    <>
      <Accordion type="multiple" className="w-full sm:w-full lg:w-1/2 text-xl">
        {lists?.length > 0 && currentGroup
          ? lists?.map((singleList, index) => {
              return (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{singleList.title}</AccordionTrigger>
                  {singleList?.listData?.map((item) => {
                    return (
                      <AccordionContent key={item.id}>
                        <div className="flex justify-between text-lg">
                          <div>{item.text}</div>
                          <div className="flex w-25">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => {
                                handleEditListItem(item, singleList);
                              }}
                            >
                              Edit
                            </Badge>
                            <Badge
                              variant="destructive"
                              className="ml-2"
                              onClick={() =>
                                handleDeleteListItem(item, singleList)
                              }
                            >
                              Delete
                            </Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    );
                  })}
                  <AccordionContent className="text-center b-1">
                    <div className="flex justify-between ">
                      <Button
                        onClick={() => {
                          handleAddNewItem(singleList);
                        }}
                      >
                        Add new item
                      </Button>
                      <Button onClick={() => deleteList(singleList)}>
                        Delete this list
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })
          : null}
      </Accordion>
      {currentGroup ? (
        <Button
          className="mt-5 w-1/2 mx-auto"
          onClick={() => {
            handleAddList();
          }}
        >
          Add new list
        </Button>
      ) : (
        <h2 className="mx-auto mt-5">
          Please do create a group to get started
        </h2>
      )}
    </>
  );
};
