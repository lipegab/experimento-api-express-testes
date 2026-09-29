const express = require("express");
const app = express();
app.use(express.json());
const DUMMY_JSON_URL = "https://dummyjson.com";
// GET /api/products
// Seleciona produtos da API externa.
app.get("/api/products", async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const response = await fetch(
            `${DUMMY_JSON_URL}/products?limit=${limit}`
        );
        if (!response.ok) {
            return res.status(502).json({
                error: "Não foi possível consultar a API externa"
            });
        }
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            error: "Erro interno ao consultar produtos"
        });
    }
});
// GET /api/products/:id
// Seleciona um produto específico.
app.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`${DUMMY_JSON_URL}/products/${id}`);
        if (response.status === 404) {
            return res.status(404).json({
                error: "Produto não encontrado"
            });
        }
        if (!response.ok) {
            return res.status(502).json({
                error: "Erro na API externa"
            });
        }
        const product = await response.json();
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            error: "Erro interno ao consultar produto"
        });
    }
});
// POST /api/products
// Simula o salvamento de um produto.
app.post("/api/products", async (req, res) => {
    try {
        const { title, price, category } = req.body;
        if (!title || price === undefined) {
            return res.status(400).json({
                error: "Os campos title e price são obrigatórios"
            });
        }
        const response = await fetch(`${DUMMY_JSON_URL}/products/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                price,
                category
            })
        });
        if (!response.ok) {
            return res.status(502).json({
                error: "Não foi possível salvar o produto"
            });
        }
        const product = await response.json();
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({
            error: "Erro interno ao salvar produto"
        });
    }
});
// DELETE /api/products/:id
// Simula a exclusão de um produto.
app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`${DUMMY_JSON_URL}/products/${id}`, {
            method: "DELETE"
        });
        if (response.status === 404) {
            return res.status(404).json({
                error: "Produto não encontrado"
            });
        }
        if (!response.ok) {
            return res.status(502).json({
                error: "Não foi possível excluir o produto"
            });
        }
        const product = await response.json();
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            error: "Erro interno ao excluir produto"
        });
    }
});
module.exports = app;