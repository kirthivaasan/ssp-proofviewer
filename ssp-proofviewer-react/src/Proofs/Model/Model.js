import { atom, selector, selectorFamily } from 'recoil';
import indCpa from './ind-cpa';

export const proofs = atom({
  key: 'proofs',
  // TODO
  default: [{ name: 'One-way function (OWF)' }, { name: 'Hardcore bit (HCB)' }, { name: 'Pseudorandom generator (PRG)' }, { name: 'Pseudorandom function (PRF)' }, indCpa],
});

export const proofNamesSelector = selector({
  key: 'proofNamesSelector',
  get: ({ get }) => get(proofs).map(({ name }) => name),
});

export const proofById = selectorFamily({ key: 'proofById', get: (id) => ({ get }) => get(proofs)[id] });
