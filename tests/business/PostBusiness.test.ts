describe("Praticando com Jest", () => {

    test("Primeiro teste", () => {
            // given

            // when

            // then
            expect(100).not.toBeGreaterThan(101)
    })

    test("Segundo teste", () => {
            // lógica do primeiro teste
            expect(100).toBeGreaterThan(99)
    })
})