import { BigInt } from "@graphprotocol/graph-ts";

import { CreateAsset, Deposit, Withdraw, Liquidate, hydro as hydroContract } from "../generated/hydro/hydro";
import { LendingPool } from '../generated/templates';
import { Pool, Asset } from '../generated/schema';

let zero = new BigInt(0);

export function handleCreateAsset(event: CreateAsset): void {
	let address = event.address;
	let poolAssetAddress = event.params.asset;
	let lendingPool = event.params.poolTokenAddress;

	let pool = new Pool(lendingPool.toHexString());
	pool.asset = poolAssetAddress.toHexString();
	pool.supplyIndex = new BigInt(1);
	pool.borrowIndex = new BigInt(1);
	pool.supplyRate = new BigInt(0);
	pool.borrowRate = new BigInt(0);
	pool.save();

	let asset = new Asset(poolAssetAddress.toHexString());
	asset.lendingPool = lendingPool.toHexString();
	asset.save();

	LendingPool.create(lendingPool);
}

export function handleDeposit(event: Deposit): void {
	let address = event.address;
	let assetAddress = event.params.asset;

	let asset = Asset.load(assetAddress.toHexString());
	if (!asset) {
		return;
	}
	let poolAddress = asset.lendingPool;
	let pool = Pool.load(poolAddress);
	// Update asset
	let hydro = hydroContract.bind(address);
	let interestRates = hydro.getInterestRates(assetAddress, zero);
	let index = hydro.getIndex(assetAddress);
	pool.borrowRate = interestRates.value0;
	pool.supplyRate = interestRates.value1;
	pool.supplyIndex = index.value0;
	pool.borrowIndex = index.value1;
	pool.save();
}

export function handleWithdraw(event: Withdraw): void {
	let address = event.address;
	let assetAddress = event.params.asset;

	let asset = Asset.load(assetAddress.toHexString());
	if (!asset) {
		return;
	}
	let poolAddress = asset.lendingPool;
	let pool = Pool.load(poolAddress);
	// Update asset
	let hydro = hydroContract.bind(address);
	let interestRates = hydro.getInterestRates(assetAddress, zero);
	let index = hydro.getIndex(assetAddress);
	pool.borrowRate = interestRates.value0;
	pool.supplyRate = interestRates.value1;
	pool.supplyIndex = index.value0;
	pool.borrowIndex = index.value1;
	pool.save();
}

export function handleLiquidate(event: Liquidate): void {
}
