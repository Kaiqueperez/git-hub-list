import { test, expect } from "@playwright/test";

const VALID_USERNAME = "vercel";

test.describe("Listagem de repositórios GitHub - fluxo principal", () => {
  test("fluxo principal: username válido, lista e stats na mesma página", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByLabel("Username do GitHub").fill(VALID_USERNAME);
    await page.getByRole("button", { name: "Buscar" }).click();

    const listHeader = page.getByRole("region", { name: "Lista de repositórios" });
    await expect(listHeader.getByText("Repositórios")).toBeVisible();

    const items = listHeader.locator("ul li");
    const totalItems = await items.count();
    if (totalItems > 0) {
      await expect(totalItems).toBeLessThanOrEqual(20);
    }

    const statsRegion = page.getByRole("region", {
      name: "Estatísticas agregadas do usuário",
    });
    await expect(statsRegion).toBeVisible();
  });

  test("filtro por linguagem e ordenação por stars/name alteram a lista", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByLabel("Username do GitHub").fill(VALID_USERNAME);
    await page.getByRole("button", { name: "Buscar" }).click();

    const listRegion = page.getByRole("region", { name: "Lista de repositórios" });
    const items = listRegion.locator("ul li");
    const initialCount = await items.count();
    if (initialCount === 0) {
      return;
    }

    const initialFirst = await items.first().innerText();

    await page.getByLabel("Ordenar por:").selectOption("name");
    await page.getByRole("button", { name: "Buscar" }).click();
    const nameSortedFirst = await items.first().innerText();

    await expect(nameSortedFirst).not.toBe(initialFirst);

    await page.getByLabel("Language (opcional)").fill("TypeScript");
    await page.getByRole("button", { name: "Buscar" }).click();

    const filteredItems = listRegion.locator("ul li");
    const filteredCount = await filteredItems.count();
    if (filteredCount > 0) {
      const languageBadges = filteredItems.first().locator("span").nth(1);
      await expect(languageBadges).toContainText("TypeScript");
    }
  });
});

