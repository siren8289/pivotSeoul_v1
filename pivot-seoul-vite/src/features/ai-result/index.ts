// ai-result feature의 공개 API입니다. 이 feature는 simulation을 import하지 않습니다.
export { default as RiskProbabilityCard } from './components/RiskProbabilityCard';
export { default as AiProgressCard } from './components/AiProgressCard';
export { toAiResult } from './api/ai-result-mapper';
export type { RawAiResult } from './api/ai-result-mapper';
export { isAiActive } from './utils/status';
export type { AiResultFields, AiStatus } from './types';
