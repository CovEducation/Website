import {
  getModelForClass,
  post,
  pre,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

export interface INum {
  value: number;
}

@pre<Num>("save", function () {
  console.log(`Saving ${this.value}`);
})
@post<Num>("save", function (num) {
  console.log(`Created Document ${num.id}`);
})
export class Num implements INum {
  @prop({ required: true })
  public value: number;

  public static async getLargestNumber(this: ReturnModelType<typeof Num>) {
    return this.find({}).sort("-value").exec();
  }
}

const NumberModel = getModelForClass(Num);

export default NumberModel;
