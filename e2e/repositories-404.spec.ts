import { test, expect } from "@playwright/test";

const INVALID_USERNAME = "this-user-should-not-exist-lcq-404";

test.describe("Listagem de repositórios GitHub - erro 404", () => {
  test("exibe mensagem de usuário não encontrado para username inexistente", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByLabel("Username do GitHub").fill(INVALID_USERNAME);
    await page.getByRole("button", { name: "Buscar" }).click();

    const errorRegion = page.getByRole("status");

    await expect(errorRegion).toContainText("Usuário não encontrado.");
  });
});

