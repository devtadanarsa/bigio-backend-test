import { IoIosClose } from "react-icons/io";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FC } from "react";

interface TagInputFieldProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  tags: string[];
  removeTag: (index: number) => void;
  className?: string;
}

const TagInputField: FC<TagInputFieldProps> = ({
  inputValue,
  setInputValue,
  handleKeyDown,
  tags,
  removeTag,
  className,
}) => {
  return (
    <div className={className}>
      <Label htmlFor="tags">
        Tags -{" "}
        <span className="text-muted-foreground">Press Enter to add tags</span>
      </Label>

      <Input
        type="text"
        id="author"
        placeholder="Enter the tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-3">
        {tags.map((tag, index) => (
          <Badge
            key={`Tag - ${index}`}
            className="rounded-sm flex items-center gap-1 w-fit mt-2"
          >
            {tag}{" "}
            <IoIosClose
              className="text-lg cursor-pointer"
              onClick={() => removeTag(index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagInputField;
