import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

export const GroupComponent = () => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const [user, setUser] = useState();
  const [lists, setLists] = useState();
  const [userGroups, setUserGroups] = useState();

  useEffect(() => {
    // dodavanje liste je gotovo , malo da se pocisti to
    // ostaje edit i delete
    let first = async () => {
      const user = await pb
        .collection("users")
        .authWithPassword("boris", "12345678");
      setUser(user);
      try {
        const userGroups = await pb.collection("listGroups").getFullList({
          filter: pb.filter(`usersParticipating.username ?= {:username}`, {
            username: user.record.username,
          }),
        });
        setUserGroups(userGroups);
        const lists = await pb.collection("list").getFullList({
          filter: userGroups[0].lists
            .map((listId) => `id ~ "${listId}"`)
            .join("||"),
        });
        setLists(lists);
      } catch (error) {
        console.log(error);
      }
    };
    first();
  }, []);

  const handleAddList = async () => {
    await pb
      .collection("list")
      .create({
        title: "Test shit",
      })
      .then(async (newList) => {
        await pb.collection("listGroups").update(userGroups[0]?.id, {
          lists: [...userGroups[0]?.lists, newList.id],
        });
      })
      .then(async () => {
        const userGroups = await pb.collection("listGroups").getFullList({
          filter: pb.filter(`usersParticipating.username ?= {:username}`, {
            username: user.record.username,
          }),
        });
        setUserGroups(userGroups);
        const updatedLists = await pb.collection("list").getFullList({
          filter: userGroups[0].lists
            .map((listId) => `id ~ "${listId}"`)
            .join("||"),
        });
        setLists(updatedLists);
      });
  };

  const handleAddNewItem = async (list) => {
    const newListItemText = prompt("Please enter new item text");
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
      .then((response) => {
        const updatedListItems = [
          ...lists.map((list) => (list.id === response.id ? response : list)),
        ];
        setLists(updatedListItems);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Button className="text-white p-4 rounded-full" onClick={handleAddList}>
        Add new list
      </Button>

      <Accordion type="multiple" className="w-full sm:w-full lg:w-1/2 text-xl">
        {lists?.map((singleList, index) => {
          return (
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger>{singleList.title}</AccordionTrigger>
              {singleList?.listData?.map((item) => {
                return (
                  <AccordionContent key={item.id}>
                    <div className="flex justify-between text-lg">
                      <div>{item.text}</div>
                      <div>
                        <Badge variant="secondary" className="cursor-pointer">
                          Edit
                        </Badge>
                        <Badge
                          variant="destructive"
                          className="ml-2 cursor-pointer"
                        >
                          Delete
                        </Badge>
                      </div>
                    </div>
                  </AccordionContent>
                );
              })}
              <AccordionContent className="text-center b-1">
                <Button
                  className="text-white p-4 rounded-full"
                  onClick={() => {
                    handleAddNewItem(singleList);
                  }}
                >
                  Add new item
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};
