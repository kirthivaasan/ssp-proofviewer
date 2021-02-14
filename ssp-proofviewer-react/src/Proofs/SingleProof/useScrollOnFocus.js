import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { selectedOracle } from '../Model/Model';

export default function useScrollOnFocus({ isSelected, target }) {
  const setSelectedOracle = useSetRecoilState(selectedOracle);

  useEffect(() => {
    if (isSelected) {
      target.current.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
      setTimeout(() => { setSelectedOracle({}); }, 1000);
    }
  },
  [isSelected, setSelectedOracle, target]);
}
