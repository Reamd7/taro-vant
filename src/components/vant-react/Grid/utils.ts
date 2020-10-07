import { GroupContextCreator } from '../common/utils';
import { VanGridProps } from '.';

export type GridContextType = Required<Omit<VanGridProps, "gid" | "className" | "custom-class">>
const map = GroupContextCreator<GridContextType>("GridItem")
export const useGridContext = map.useGroupContainerContext
export const useGridItemContext = map.useGroupItemContext
