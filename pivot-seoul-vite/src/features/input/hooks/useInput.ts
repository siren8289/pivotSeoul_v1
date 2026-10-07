import { useContext } from 'react';
import { InputContext } from '../context/InputContext';

export function useInput() {
  const value = useContext(InputContext);
  if (!value) throw new Error('useInput은 InputProvider 안에서만 사용할 수 있습니다.');
  return value;
}
