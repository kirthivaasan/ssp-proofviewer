import { useContext, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import ProofContext from './ProofContext';
import { selectedOracle } from '../Model/Model';

export default function useMathJaxEventHandler({ name, packageName, setPopperValues }) {
  const proof = useContext(ProofContext);
  const setSelectedOracle = useSetRecoilState(selectedOracle);

  useEffect(() => {
    const listener = ({ detail: { name: targetName, sourceOracle, sourcePackage } }) => {
      if (sourceOracle !== name || sourcePackage !== packageName) {
        return;
      }

      const potentialPackages = proof.monolithicPackages
        .filter(({ oracles }) => !!(oracles.find(({ name: findName }) => findName === targetName)))
        .map(({ name: pname }) => pname);

      if (potentialPackages.length === 0) {
        return;
      }

      if (potentialPackages.length === 1) {
        setSelectedOracle({ package: potentialPackages[0], oracle: targetName });
        return;
      }

      setPopperValues({ potentialPackages, targetName });
    };

    window.addEventListener('oracleSelected', listener);
    return () => window.removeEventListener('oracleSelected', listener);
  }, [name, packageName, proof.monolithicPackages, setSelectedOracle, setPopperValues]);
}
