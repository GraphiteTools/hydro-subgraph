import { Address, BigInt } from "@graphprotocol/graph-ts";

import { Mint, Burn, Borrow, Repay } from "../generated/templates/LendingPool/LendingPool";
import { Pool, User, Balance } from "../generated/schema";

export function handleMint(event: Mint): void {
	let address = event.address;
	let userAddress = event.params.user;
	let value = event.params.value;

	let pool = Pool.load(address.toHexString());
	let assetAddress = Address.fromHexString(pool.asset) as Address;

	// Update user balance
	let userId = userAddress.toHexString();
	let user = User.load(userId);
	if (!user) {
		user = new User(userId);
		user.save();
	}
	let balanceId = userAddress.toHexString() + '-' + assetAddress.toHexString();
	let balance = Balance.load(balanceId);
	if (!balance) {
		balance = new Balance(balanceId);
		balance.user = userId;
		balance.balance = new BigInt(0);
		balance.asset = assetAddress.toHexString();
	}
	balance.balance += value;
	balance.save();
}

export function handleBurn(event: Burn): void {
	let address = event.address;
	let userAddress = event.params.user;
	let value = event.params.value;

	let pool = Pool.load(address.toHexString());
	let assetAddress = Address.fromHexString(pool.asset) as Address;

	// Update user balance
	let userId = userAddress.toHexString();
	let user = User.load(userId);
	if (!user) {
		user = new User(userId);
		user.save();
	}
	let balanceId = userAddress.toHexString() + '-' + assetAddress.toHexString();
	let balance = Balance.load(balanceId);
	if (!balance) {
		balance = new Balance(balanceId);
		balance.user = userId;
		balance.balance = new BigInt(0);
		balance.asset = assetAddress.toHexString();
	}
	balance.balance -= value;
	balance.save();
}

export function handleBorrow(event: Borrow): void {
}

export function handleRepay(event: Repay): void {
}
