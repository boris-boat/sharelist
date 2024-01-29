import { getLists, setLists } from "@/redux/listsSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "@/components/ui/badge";
import PocketBase from "pocketbase";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getGroups,
  setCurrentGroup,
  updateCurrentGroup,
} from "@/redux/groupSlice";
import { useEffect } from "react";
import { Button } from "../ui/button";
export const GroupComponent = () => {
  const user = useSelector((state) => state.user.userData);
  const userGroups = useSelector((state) => state.group.userGroups);
  const lists = useSelector((state) => state.lists.lists);
  const currentGroup = useSelector((state) => state.group.currentGroup);
  const currentGroupIdSelected = useSelector(
    (state) => state.user?.userData?.record?.groupSelected
  );
  const pb = new PocketBase("http://127.0.0.1:8090");
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
  }, []);

  const handleAddList = async () => {
    const newTitle = prompt("Please enter new list title");
    if (!newTitle) {
      return;
    }
    await pb
      .collection("list")
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
  };

  const deleteList = async (listToDelete) => {
    const res = await pb.collection("list").delete(listToDelete.id);
    if (res) {
      dispatch(getGroups()).then(() => {
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
        {lists?.length > 0 &&
          lists?.map((singleList, index) => {
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
                    <AddItemButton
                      onClick={() => {
                        handleAddNewItem(singleList);
                      }}
                    >
                      Add new item
                    </AddItemButton>
                    <Button onClick={() => deleteList(singleList)}>
                      Delete this list
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
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

export const AddItemButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      title="Add New"
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          strokeWidth="1.5"
        ></path>
        <path d="M8 12H16" strokeWidth="1.5"></path>
        <path d="M12 16V8" strokeWidth="1.5"></path>
      </svg>
    </button>
  );
};
