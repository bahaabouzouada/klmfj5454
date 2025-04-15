
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  title: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  title: string;
  filterGroups: FilterGroup[];
}

const FilterSidebar = ({ title, filterGroups }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(filterGroups.map((group) => [group.title, true]))
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="space-y-4">
        {filterGroups.map((group) => (
          <Collapsible
            key={group.title}
            open={openSections[group.title]}
            onOpenChange={() => toggleSection(group.title)}
          >
            <div className="border-b pb-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-between p-0 hover:bg-transparent"
                >
                  <span className="font-medium">{group.title}</span>
                  {openSections[group.title] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                {group.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox id={option.id} />
                    <label
                      htmlFor={option.id}
                      className="text-gray-700 cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-6">
        <Button className="w-full bg-teal-500 hover:bg-teal-600">
          تطبيق الفلاتر
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
