// value는 API에 전송하는 코드이며 서버 enum과 일치해야 합니다.
export const lifeStages = [
  { value: 'YOUTH', label: '청년' },
  { value: 'NEWLYWED', label: '신혼부부' },
  { value: 'GENERAL', label: '일반' },
  { value: 'SENIOR', label: '고령자' },
] as const;

export const lifeStageLabel = (value: string) => lifeStages.find(stage => stage.value === value)?.label ?? value;
