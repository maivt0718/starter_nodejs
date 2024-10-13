import { expect } from "chai"

describe (`Math operation`, () => {
    it(`should add 2 interger`, () => {
        const result = 10 + 10
        expect(result).to.equal(20)
    })
    it(`testing with array`,() => {
        const arr = [1,2,4]
        expect(arr).to.include(1)
    })
})