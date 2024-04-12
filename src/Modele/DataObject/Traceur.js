class Traceur {
    constructor(L1, L2, L3) {
        this.L1 = L1;
        this.L2 = L2;
        this.L3 = L3;
    }

    getL1() {
        return this.L1;
    }

    getL2() {
        return this.L2;
    }

    getL3() {
        return this.L3;
    }

    setL1(L1) {
        this.L1 = L1;
    }

    setL2(L2) {
        this.L2 = L2;
    }

    setL3(L3) {
        this.L3 = L3;
    }

    toString() {
        return "Traceur [L1=" + this.L1 + ", L2=" + this.L2 + ", L3=" + this.L3 + "]";
    }
}