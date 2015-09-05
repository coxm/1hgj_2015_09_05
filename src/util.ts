module jam {

export function rangeIncl(minIncl: number, maxIncl: number): number[] {
	var a: number[] = new Array(maxIncl - minIncl + 1),
		i: number = minIncl;
	for (; i <= maxIncl; ++i) {
		a[i] = i;
	}
	return a;
}


export function randInt(min: number, max: number): number {
  return Math.random() * (max -min) + min;
}


export function dist(a: Phaser.Sprite, b: Phaser.Sprite): number {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) +
    (a.y - b.y) * (a.y - b.y)
  );
}

} // module jam
