const request = require("supertest");
const app = require("../src/app");
describe("API de produtos", () => {
    describe("GET /api/products", () => {
        test("deve retornar uma lista de produtos", async () => {
            const response = await request(app)
                .get("/api/products?limit=3")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body).toHaveProperty("products");
            expect(Array.isArray(response.body.products)).toBe(true);
            expect(response.body.products.length).toBeGreaterThan(0);
        });
    });
    describe("GET /api/products/:id", () => {
        test("deve retornar um produto existente", async () => {
            const response = await request(app)
                .get("/api/products/1")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body).toHaveProperty("title");
        });
        test("deve retornar 404 para um produto inexistente", async () => {
            const response = await request(app)
                .get("/api/products/999999")
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body).toEqual({
                error: "Produto não encontrado"
            });
        });
    });
    describe("POST /api/products", () => {
        test("deve simular o salvamento de um produto", async () => {
            const newProduct = {
                title: "Produto de teste",
                price: 49.9,
                category: "testes"
            };
            const response = await request(app)
                .post("/api/products")
                .send(newProduct)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.title).toBe(newProduct.title);
            expect(response.body.price).toBe(newProduct.price);
        });
        test("deve rejeitar produto sem título", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({
                    price: 20
                })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body).toEqual({
                error: "Os campos title e price são obrigatórios"
            });
        });
    });
    describe("DELETE /api/products/:id", () => {
        test("deve simular a exclusão de um produto", async () => {
            const response = await request(app)
                .delete("/api/products/1")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
            expect(response.body.isDeleted).toBe(true);
            expect(response.body).toHaveProperty("deletedOn");
        });
    });
});