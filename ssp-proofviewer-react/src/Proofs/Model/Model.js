import { atom, selector, selectorFamily } from 'recoil';
import indCpa from './ind-cpa';
import gameToSim from './game-to-sim-ind-cpa-for-se.json'

export const proofs = atom({
  key: 'proofs',
  // TODO
  default: [{ name: 'One-way function (OWF)' }, { name: 'Hardcore bit (HCB)' }, { name: 'Pseudorandom generator (PRG)' }, { name: 'Pseudorandom function (PRF)' }, indCpa, gameToSim ],
});

export const selectedOracle = atom({
  key: 'oracle',
  default: {},
});

export const isSelectedOracle = selectorFamily(
  {
    key: 'isSelectedOracle',
    get: ({ oracleName, packageName }) => ({ get }) => get(selectedOracle).package === packageName
      && get(selectedOracle).oracle === oracleName,
  },
);

export const proofNamesSelector = selector({
  key: 'proofNamesSelector',
  get: ({ get }) => get(proofs).map(({ name }) => name),
});

export const proofById = selectorFamily({ key: 'proofById', get: (id) => ({ get }) => get(proofs)[id] });
