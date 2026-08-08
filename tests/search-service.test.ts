import test from "node:test";
import assert from "node:assert/strict";
import { searchBizLink } from "../lib/search-service";

test("resolves packaging queries to the correct business type and returns business-specific results", () => {
  const crochetResults = searchBizLink("Packaging for Crochet");
  assert.equal(crochetResults.businessType, "Crochet");
  assert.ok(crochetResults.databaseMatched);
  assert.ok(crochetResults.materials.some((item) => item.businessTypes.includes("Crochet")));

  const chocolateResults = searchBizLink("Packaging for Chocolate");
  assert.equal(chocolateResults.businessType, "Chocolates");
  assert.ok(chocolateResults.databaseMatched);
  assert.ok(chocolateResults.materials.every((item) => item.businessTypes.includes("Chocolates")));
  assert.ok(chocolateResults.boxes.every((item) => item.businessTypes.includes("Chocolates")));
  assert.ok(chocolateResults.accessories.every((item) => item.businessTypes.includes("Chocolates")));
});

test("keeps bubble wrap contextual instead of universal", () => {
  const chocolateResults = searchBizLink("Packaging for Chocolate");
  const bubbleWrapResults = searchBizLink("Bubble Wrap");

  assert.ok(chocolateResults.materials.every((item) => !item.name.toLowerCase().includes("bubble wrap")));
  assert.ok(bubbleWrapResults.materials.some((item) => item.name.toLowerCase().includes("bubble wrap")));
});
