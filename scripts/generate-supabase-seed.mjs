import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/data/dishes.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const cjsModule = { exports: {} };
vm.runInNewContext(compiled, { module: cjsModule, exports: cjsModule.exports, encodeURIComponent });
const { dishes } = cjsModule.exports;
const q = (value) => value === null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const arr = (values) => `array[${values.map(q).join(",")}]::text[]`;
const lines = ["begin;"];

for (const dish of dishes) {
  lines.push(`insert into public.dishes(id,slug,name,category,tags,difficulty,cook_minutes,servings,description,emoji,tone,tips,video_url,featured,active) values(${q(dish.id)},${q(dish.slug)},${q(dish.name)},${q(dish.category)},${arr(dish.tags)},${q(dish.difficulty)},${dish.cookMinutes},${dish.servings},${q(dish.description)},${q(dish.emoji)},${q(dish.tone)},${arr(dish.tips)},${q(dish.videoUrl)},${dish.featured ? "true" : "false"},true) on conflict(id) do update set slug=excluded.slug,name=excluded.name,category=excluded.category,tags=excluded.tags,difficulty=excluded.difficulty,cook_minutes=excluded.cook_minutes,servings=excluded.servings,description=excluded.description,emoji=excluded.emoji,tone=excluded.tone,tips=excluded.tips,video_url=excluded.video_url,featured=excluded.featured,active=true;`);
  lines.push(`delete from public.dish_ingredients where dish_id=${q(dish.id)};`);
  [...dish.ingredients.map((item) => ({ ...item, kind: "ingredient" })), ...dish.seasonings.map((item) => ({ ...item, kind: "seasoning" }))].forEach((item, index) => {
    lines.push(`insert into public.ingredients(name,category,default_unit) values(${q(item.name)},${q(item.category)},${q(item.unit)}) on conflict(name,category) do update set default_unit=excluded.default_unit;`);
    lines.push(`insert into public.dish_ingredients(dish_id,ingredient_id,kind,amount,unit,display_amount,optional,sort_order) select ${q(dish.id)},id,${q(item.kind)},${item.amount ?? "null"},${q(item.unit)},${q(item.displayAmount)},${item.optional ? "true" : "false"},${index} from public.ingredients where name=${q(item.name)} and category=${q(item.category)};`);
  });
  lines.push(`delete from public.recipe_steps where dish_id=${q(dish.id)};`);
  dish.steps.forEach((step, index) => lines.push(`insert into public.recipe_steps(dish_id,step_number,title,description) values(${q(dish.id)},${index + 1},${q(step.title)},${q(step.description)});`));
}
lines.push("commit;");
fs.writeFileSync(new URL("../supabase/seed.sql", import.meta.url), `${lines.join("\n")}\n`);
console.log(`Generated seed for ${dishes.length} dishes.`);
