import { useEffect, useState, type ReactNode } from "react";
import ollama from "ollama";
import { Select, message } from "antd";

interface IOption {
  value: string;
  label: ReactNode;
}

export interface IModelsSelectProps {
  className?: string;
  onSelect?: (name: string, option: IOption) => void;
}

const ModelsSelect = ({ className, onSelect }: IModelsSelectProps) => {
  const [options, setOptions] = useState<IOption[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    (async () => {
      try {
        const response = await ollama.list();
        const models = response?.models ?? [];

        setOptions(
          models.map<IOption>((model) => ({
            value: model.model,
            label: model.name,
          })),
        );
      } catch (e) {
        messageApi.open({
          type: "error",
          content: "Connection Error. Check Ollama",
        });
      }
    })();
  }, []);

  return (
    <>
      <Select
        style={{ width: 250 }}
        className={className}
        options={options}
        onSelect={onSelect}
      />
      {contextHolder}
    </>
  );
};

export default ModelsSelect;
