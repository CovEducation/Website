import NumberModel, { Num } from "../models/Numbers";

class MainService {
  private _double = (x: number) => x * 2;

  doubleNum(x: number) {
    return this._double(x);
  }

  saveNum(x: number): Promise<Num> {
    const doc = new NumberModel({ value: x });
    return doc.save();
  }
}

export default new MainService();
