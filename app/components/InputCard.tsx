import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { memo, useCallback, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function InputCard(props: {
  index: number;
  name: string;
  value: number;
  onUpdate?: (index: number, name: string, value: number) => void;
  onDelete?: (index: number) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dialog 열기
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleFormSave = useCallback(
    (name: string, value: string) => {
      const newValue = parseFloat(value) || 0;
      props.onUpdate?.(props.index, name, newValue);
      setIsDialogOpen(false);
    },
    [props.index, props.onUpdate]
  );

  const handleFormCancel = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleDelete = () => {
    props.onDelete?.(props.index);
  };

  // EditForm을 완전히 독립적인 컴포넌트로 분리
  const EditForm = memo(
    ({
      initialName,
      initialValue,
      onSave,
      onCancel,
    }: {
      initialName: string;
      initialValue: string;
      onSave: (name: string, value: string) => void;
      onCancel: () => void;
    }) => {
      const [localName, setLocalName] = useState(initialName);
      const [localValue, setLocalValue] = useState(initialValue);

      const handleSave = () => {
        onSave(localName, localValue);
      };

      return (
        <View className="p-6 w-full">
          <Text className="text-xl font-bold mb-4 text-center">
            음식 정보 수정
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              음식 이름
            </Text>
            <TextInput
              value={localName}
              onChangeText={setLocalName}
              placeholder="음식 이름을 입력하세요"
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">수량</Text>
            <TextInput
              value={localValue}
              onChangeText={setLocalValue}
              placeholder="수량을 입력하세요"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-500 px-6 py-3 rounded-lg flex-1 mr-2"
              onPress={onCancel}
            >
              <Text className="text-white text-center font-semibold">취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg flex-1 ml-2"
              onPress={handleSave}
            >
              <Text className="text-white text-center font-semibold">저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  );
  return (
    <>
      <View className="flex-row justify-between items-center bg-white rounded-xl p-4 w-[90%] overflow-scroll-y">
        <View className="flex-row justify-between items-center w-[80%]">
          <View>
            <Text>{props.index}번째 음식</Text>
            <Text>{props.name}</Text>
            <Text>{props.value}</Text>
          </View>
          <View>
            <Image
              source={require("../../assets/images/fff.png")}
              className="w-32 h-32 rounded-md"
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            className=" items-center justify-center p-2 my-4 w-10 h-10"
            onPress={handleOpenDialog}
          >
            <MaterialIcons name="edit" size={24} color="steelblue" />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center rounded-full p-2 my-4 w-10 h-10"
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-300">
          <EditForm
            initialName={props.name}
            initialValue={props.value.toString()}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
