import { GroupContextCreator } from '../common/utils';

type CheckBoxGroupType = {
  groupdisabled: boolean;
  value: Array<string>; // 懒得用 Array
  max: number;
  onChange: ((key: string, checked: boolean) => boolean)
}
const map = GroupContextCreator<CheckBoxGroupType>("CheckBox")
export const useCheckboxGroupContext = map.useGroupContainerContext
export const useCheckboxGroupItemContext = map.useGroupItemContext
