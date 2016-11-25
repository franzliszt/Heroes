export class Kalkulator {
    private rentefot = 0.07;

    beregn(belop: number, tid: number): number {
        let y = (this.rentefot * belop) /
            (1 - Math.pow((1 + this.rentefot), -tid));

        return parseFloat((y / 12).toFixed(2));
    }
}