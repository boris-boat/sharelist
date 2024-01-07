import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "@/components/ui/badge";
import { tmpDb } from "../../tmpdb.js";
import { Button } from "@/components/ui/button";
export const GroupComponent = () => {
  return (
    <Accordion type="multiple" className="w-full sm:w-full lg:w-1/2 text-xl">
      {tmpDb?.content?.map((textGroup, index) => {
        return (
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger>{textGroup.title}</AccordionTrigger>
            {textGroup.items.map((item) => {
              return (
                <AccordionContent>
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
              <Button className="text-white p-4 rounded-full">
                Add new item
              </Button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
