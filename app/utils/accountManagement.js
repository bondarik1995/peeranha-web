import { saveText } from './ipfs';
import { REGISTER_ACC, ACCOUNT_TABLE, ALL_ACCOUNTS_SCOPE } from './constants';

export async function registerAccount(
  accountName,
  displayName,
  profile,
  eosService,
) {
  const profileText = JSON.stringify(profile);
  const ipfsHash = await saveText(profileText);

  await eosService.sendTransaction(accountName, REGISTER_ACC, {
    owner: accountName,
    display_name: displayName,
    ipfs_profile: ipfsHash,
  });

  // TODO: add here wait for transaction to be added to a block

  return true;
}

export async function isUserInSystem(user, eosService) {
  const profile = user
    ? await eosService.getTableRow(ACCOUNT_TABLE, ALL_ACCOUNTS_SCOPE, user)
    : false;

  return !!profile;
}