export type BlockCategory = 'move' | 'sense' | 'control' | 'action' | 'logic' | 'variable';

export type BlockType =
  // Move
  | 'forward'
  | 'backward'
  | 'turn_left'
  | 'turn_right'
  // Sense
  | 'sense_distance'
  | 'sense_on_line'
  | 'sense_at_goal'
  | 'sense_wall_ahead'
  // Control
  | 'repeat_times'
  | 'while_cond'
  | 'if_then'
  | 'if_then_else'
  // Action
  | 'pick_up'
  | 'drop'
  | 'say'
  // Logic
  | 'logic_not'
  | 'logic_compare'
  | 'logic_and_or'
  // Variable
  | 'set_var'
  | 'change_var';

export interface BlockCondition {
  type: 'sense_wall_ahead' | 'sense_on_line' | 'sense_at_goal' | 'not_at_goal' | 'not_wall_ahead' | 'compare';
  operator?: '<' | '>' | '==' | '!=';
  left?: string;
  right?: string | number;
}

export interface BlockItem {
  id: string;
  type: BlockType;
  category: BlockCategory;
  valNumber?: number;
  valText?: string;
  varName?: string;
  condition?: BlockCondition;
  children?: BlockItem[];
  elseChildren?: BlockItem[];
}

export interface BlockDefinition {
  type: BlockType;
  category: BlockCategory;
  label: string;
  color: string;
  textColor: string;
  defaultItem: () => BlockItem;
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  forward: {
    type: 'forward',
    category: 'move',
    label: 'move forward',
    color: '#2F5BFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'forward', category: 'move', valNumber: 1 }),
  },
  backward: {
    type: 'backward',
    category: 'move',
    label: 'move backward',
    color: '#2F5BFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'backward', category: 'move', valNumber: 1 }),
  },
  turn_left: {
    type: 'turn_left',
    category: 'move',
    label: 'turn left ↺',
    color: '#2F5BFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'turn_left', category: 'move' }),
  },
  turn_right: {
    type: 'turn_right',
    category: 'move',
    label: 'turn right ↻',
    color: '#2F5BFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'turn_right', category: 'move' }),
  },
  sense_distance: {
    type: 'sense_distance',
    category: 'sense',
    label: 'distance ahead',
    color: '#FF7AC6',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'sense_distance', category: 'sense' }),
  },
  sense_on_line: {
    type: 'sense_on_line',
    category: 'sense',
    label: 'on line?',
    color: '#FF7AC6',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'sense_on_line', category: 'sense' }),
  },
  sense_at_goal: {
    type: 'sense_at_goal',
    category: 'sense',
    label: 'at goal?',
    color: '#FF7AC6',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'sense_at_goal', category: 'sense' }),
  },
  sense_wall_ahead: {
    type: 'sense_wall_ahead',
    category: 'sense',
    label: 'wall ahead?',
    color: '#FF7AC6',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'sense_wall_ahead', category: 'sense' }),
  },
  repeat_times: {
    type: 'repeat_times',
    category: 'control',
    label: 'repeat',
    color: '#FFD23F',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'repeat_times', category: 'control', valNumber: 4, children: [] }),
  },
  while_cond: {
    type: 'while_cond',
    category: 'control',
    label: 'repeat while',
    color: '#FFD23F',
    textColor: '#14110F',
    defaultItem: () => ({
      id: `b_${Math.random().toString(36).substring(2, 9)}`,
      type: 'while_cond',
      category: 'control',
      condition: { type: 'not_at_goal' },
      children: [],
    }),
  },
  if_then: {
    type: 'if_then',
    category: 'control',
    label: 'if',
    color: '#FFD23F',
    textColor: '#14110F',
    defaultItem: () => ({
      id: `b_${Math.random().toString(36).substring(2, 9)}`,
      type: 'if_then',
      category: 'control',
      condition: { type: 'sense_wall_ahead' },
      children: [],
    }),
  },
  if_then_else: {
    type: 'if_then_else',
    category: 'control',
    label: 'if / else',
    color: '#FFD23F',
    textColor: '#14110F',
    defaultItem: () => ({
      id: `b_${Math.random().toString(36).substring(2, 9)}`,
      type: 'if_then_else',
      category: 'control',
      condition: { type: 'sense_wall_ahead' },
      children: [],
      elseChildren: [],
    }),
  },
  pick_up: {
    type: 'pick_up',
    category: 'action',
    label: 'pick up item',
    color: '#B6F23A',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'pick_up', category: 'action' }),
  },
  drop: {
    type: 'drop',
    category: 'action',
    label: 'drop item',
    color: '#B6F23A',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'drop', category: 'action' }),
  },
  say: {
    type: 'say',
    category: 'action',
    label: 'say',
    color: '#B6F23A',
    textColor: '#14110F',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'say', category: 'action', valText: 'Hello world!' }),
  },
  logic_not: {
    type: 'logic_not',
    category: 'logic',
    label: 'not',
    color: '#7B5CFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'logic_not', category: 'logic' }),
  },
  logic_compare: {
    type: 'logic_compare',
    category: 'logic',
    label: 'compare',
    color: '#7B5CFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'logic_compare', category: 'logic' }),
  },
  logic_and_or: {
    type: 'logic_and_or',
    category: 'logic',
    label: 'and / or',
    color: '#7B5CFF',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'logic_and_or', category: 'logic' }),
  },
  set_var: {
    type: 'set_var',
    category: 'variable',
    label: 'set variable',
    color: '#FF6B2C',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'set_var', category: 'variable', varName: 'x', valNumber: 0 }),
  },
  change_var: {
    type: 'change_var',
    category: 'variable',
    label: 'change variable by',
    color: '#FF6B2C',
    textColor: '#FFFFFF',
    defaultItem: () => ({ id: `b_${Math.random().toString(36).substring(2, 9)}`, type: 'change_var', category: 'variable', varName: 'x', valNumber: 1 }),
  },
};

