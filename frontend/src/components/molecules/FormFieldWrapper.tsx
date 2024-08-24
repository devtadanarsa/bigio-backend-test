import { FC } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Bold, Essentials, Italic, Paragraph } from "ckeditor5";

interface FormFieldWrapperProps {
  name: string;
  label: string;
  placeholder: string;
  control: any;
  defaultValue?: string;
  componentType?: "input" | "textarea" | "select" | "file" | "richText";
  selectOptions?: string[];
  className?: string;
}

const FormFieldWrapper: FC<FormFieldWrapperProps> = ({
  name,
  label,
  placeholder,
  control,
  defaultValue,
  componentType = "input",
  selectOptions = [],
  className = "",
}) => {
  const renderControl = (field) => {
    switch (componentType) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            defaultValue={defaultValue}
          />
        );
      case "select":
        return (
          <Select onValueChange={field.onChange} value={defaultValue}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectOptions.map((option, index) => (
                  <SelectItem key={`${option} - ${index}`} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      case "richText":
        return (
          <CKEditor
            editor={ClassicEditor}
            config={{
              plugins: [Essentials, Bold, Italic, Paragraph],
              toolbar: ["undo", "redo", "|", "bold", "italic"],
            }}
            data={field.value}
            onChange={(_, editor) => {
              const data = editor.getData();
              field.onChange(data);
            }}
          />
        );

      case "file":
        return <Input type="file" className="cursor-pointer" {...field} />;

      default:
        return <Input placeholder={placeholder} {...field} />;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderControl(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldWrapper;
