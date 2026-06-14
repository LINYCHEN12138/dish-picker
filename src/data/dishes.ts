import type { Dish, DishCategory, Difficulty, Ingredient, IngredientCategory } from "@/types/dish";

const item = (
  name: string,
  displayAmount: string,
  category: IngredientCategory,
  amount: number | null = null,
  unit = "",
): Ingredient => ({ name, displayAmount, category, amount, unit });

const pantry = (...names: string[]) => names.map((name) => item(name, "适量", "pantry"));

type DishSeed = {
  name: string;
  category: DishCategory;
  emoji: string;
  tone: string;
  main: [string, string, IngredientCategory][];
  tags?: string[];
  difficulty?: Difficulty;
  minutes?: number;
  tip?: string;
  featured?: boolean;
};

const seeds: DishSeed[] = [
  { name: "番茄炒蛋", category: "快手菜", emoji: "🍅", tone: "coral", main: [["番茄", "2个", "vegetable"], ["鸡蛋", "3个", "egg"]], tags: ["下饭", "零失败"], featured: true },
  { name: "青椒肉丝", category: "荤菜", emoji: "🫑", tone: "green", main: [["青椒", "3个", "vegetable"], ["猪里脊", "250克", "meat"]], tags: ["下饭", "快炒"] },
  { name: "鱼香肉丝", category: "荤菜", emoji: "🥢", tone: "amber", main: [["猪里脊", "250克", "meat"], ["胡萝卜", "半根", "vegetable"], ["木耳", "1小把", "vegetable"]], tags: ["酸甜", "下饭"], difficulty: "适中" },
  { name: "宫保鸡丁", category: "荤菜", emoji: "🥜", tone: "red", main: [["鸡胸肉", "300克", "meat"], ["花生米", "1小碗", "staple"], ["黄瓜", "半根", "vegetable"]], tags: ["香辣", "经典"], difficulty: "适中", featured: true },
  { name: "可乐鸡翅", category: "荤菜", emoji: "🍗", tone: "brown", main: [["鸡中翅", "10个", "meat"], ["可乐", "1罐", "staple"]], tags: ["甜香", "人气"], minutes: 35, featured: true },
  { name: "土豆烧牛肉", category: "荤菜", emoji: "🥔", tone: "amber", main: [["牛腩", "400克", "meat"], ["土豆", "2个", "vegetable"]], tags: ["炖菜", "暖胃"], minutes: 70, difficulty: "适中" },
  { name: "红烧排骨", category: "荤菜", emoji: "🍖", tone: "red", main: [["排骨", "500克", "meat"]], tags: ["浓香", "硬菜"], minutes: 60, difficulty: "适中" },
  { name: "糖醋里脊", category: "荤菜", emoji: "🥩", tone: "coral", main: [["猪里脊", "350克", "meat"]], tags: ["酸甜", "酥香"], minutes: 40, difficulty: "进阶" },
  { name: "回锅肉", category: "荤菜", emoji: "🌶️", tone: "red", main: [["五花肉", "350克", "meat"], ["青蒜", "3根", "vegetable"]], tags: ["川味", "下饭"], minutes: 35, difficulty: "适中" },
  { name: "蒜薹炒肉", category: "荤菜", emoji: "🥬", tone: "green", main: [["蒜薹", "300克", "vegetable"], ["猪肉", "200克", "meat"]], tags: ["家常", "快炒"] },
  { name: "香菇滑鸡", category: "荤菜", emoji: "🍄", tone: "brown", main: [["鸡腿肉", "350克", "meat"], ["香菇", "8朵", "vegetable"]], tags: ["鲜香", "嫩滑"], minutes: 35 },
  { name: "黑椒牛柳", category: "荤菜", emoji: "🥩", tone: "brown", main: [["牛里脊", "300克", "meat"], ["彩椒", "2个", "vegetable"]], tags: ["黑椒", "快炒"], difficulty: "适中" },
  { name: "麻婆豆腐", category: "快手菜", emoji: "🌶️", tone: "red", main: [["嫩豆腐", "1盒", "staple"], ["肉末", "100克", "meat"]], tags: ["麻辣", "下饭"], featured: true },
  { name: "家常豆腐", category: "素菜", emoji: "🥡", tone: "amber", main: [["老豆腐", "1块", "staple"], ["青椒", "1个", "vegetable"], ["木耳", "1小把", "vegetable"]], tags: ["家常", "豆香"] },
  { name: "地三鲜", category: "素菜", emoji: "🍆", tone: "purple", main: [["茄子", "1根", "vegetable"], ["土豆", "1个", "vegetable"], ["青椒", "1个", "vegetable"]], tags: ["东北味", "下饭"], difficulty: "适中" },
  { name: "干煸四季豆", category: "素菜", emoji: "🫛", tone: "green", main: [["四季豆", "350克", "vegetable"], ["肉末", "80克", "meat"]], tags: ["香辣", "干香"], difficulty: "适中" },
  { name: "蒜蓉西兰花", category: "素菜", emoji: "🥦", tone: "green", main: [["西兰花", "1颗", "vegetable"], ["蒜", "5瓣", "vegetable"]], tags: ["清爽", "低负担"], minutes: 15, featured: true },
  { name: "清炒上海青", category: "素菜", emoji: "🥬", tone: "green", main: [["上海青", "400克", "vegetable"]], tags: ["清爽", "快手"], minutes: 12 },
  { name: "手撕包菜", category: "素菜", emoji: "🥬", tone: "green", main: [["包菜", "半颗", "vegetable"], ["干辣椒", "4个", "seasoning"]], tags: ["脆爽", "下饭"], minutes: 15 },
  { name: "酸辣土豆丝", category: "快手菜", emoji: "🥔", tone: "amber", main: [["土豆", "2个", "vegetable"], ["青椒", "1个", "vegetable"]], tags: ["酸辣", "脆爽"], minutes: 18 },
  { name: "蚝油生菜", category: "素菜", emoji: "🥬", tone: "green", main: [["生菜", "2颗", "vegetable"], ["蒜", "4瓣", "vegetable"]], tags: ["清鲜", "快手"], minutes: 10 },
  { name: "虾仁滑蛋", category: "海鲜", emoji: "🍤", tone: "coral", main: [["虾仁", "200克", "meat"], ["鸡蛋", "4个", "egg"]], tags: ["嫩滑", "鲜香"], minutes: 18, featured: true },
  { name: "蒜蓉粉丝虾", category: "海鲜", emoji: "🦐", tone: "coral", main: [["鲜虾", "12只", "meat"], ["粉丝", "1把", "staple"], ["蒜", "1头", "vegetable"]], tags: ["蒸菜", "鲜香"], minutes: 30, difficulty: "适中" },
  { name: "清蒸鲈鱼", category: "海鲜", emoji: "🐟", tone: "blue", main: [["鲈鱼", "1条", "meat"], ["小葱", "3根", "vegetable"], ["姜", "1块", "vegetable"]], tags: ["清鲜", "蒸菜"], minutes: 30, difficulty: "适中" },
  { name: "番茄炖牛腩", category: "汤羹", emoji: "🥘", tone: "coral", main: [["牛腩", "500克", "meat"], ["番茄", "3个", "vegetable"]], tags: ["浓汤", "暖胃"], minutes: 90, difficulty: "适中" },
  { name: "冬瓜排骨汤", category: "汤羹", emoji: "🍲", tone: "blue", main: [["排骨", "400克", "meat"], ["冬瓜", "500克", "vegetable"]], tags: ["清甜", "汤羹"], minutes: 70 },
  { name: "紫菜蛋花汤", category: "汤羹", emoji: "🥣", tone: "blue", main: [["紫菜", "1小把", "vegetable"], ["鸡蛋", "2个", "egg"]], tags: ["快手", "清淡"], minutes: 10 },
  { name: "玉米山药鸡汤", category: "汤羹", emoji: "🌽", tone: "amber", main: [["鸡腿", "2只", "meat"], ["玉米", "1根", "vegetable"], ["山药", "半根", "vegetable"]], tags: ["滋味", "暖胃"], minutes: 80 },
  { name: "扬州炒饭", category: "主食", emoji: "🍚", tone: "amber", main: [["隔夜米饭", "2碗", "staple"], ["鸡蛋", "2个", "egg"], ["虾仁", "100克", "meat"]], tags: ["一锅出", "快手"], minutes: 20 },
  { name: "葱油拌面", category: "主食", emoji: "🍜", tone: "green", main: [["面条", "2人份", "staple"], ["小葱", "1把", "vegetable"]], tags: ["葱香", "快手"], minutes: 20 },
  { name: "肉末茄子", category: "荤菜", emoji: "🍆", tone: "purple", main: [["茄子", "2根", "vegetable"], ["肉末", "150克", "meat"]], tags: ["软糯", "下饭"], minutes: 30 },
  { name: "莲藕炒肉片", category: "荤菜", emoji: "🪷", tone: "coral", main: [["莲藕", "1节", "vegetable"], ["猪肉", "200克", "meat"]], tags: ["脆爽", "家常"], minutes: 25 },
];

const slugify = (name: string, index: number) => `dish-${String(index + 1).padStart(2, "0")}`;

export const dishes: Dish[] = seeds.map((seed, index) => {
  const ingredients = seed.main.map(([name, amount, category]) => item(name, amount, category));
  const mainNames = ingredients.map((ingredient) => ingredient.name).join("、");
  return {
    id: String(index + 1),
    slug: slugify(seed.name, index),
    name: seed.name,
    category: seed.category,
    tags: seed.tags ?? ["家常", "好吃"],
    difficulty: seed.difficulty ?? "简单",
    cookMinutes: seed.minutes ?? 25,
    servings: 2,
    description: `把${mainNames}做得恰到好处，是很适合两个人晚餐的一道${seed.name}。`,
    emoji: seed.emoji,
    tone: seed.tone,
    ingredients,
    seasonings: [
      item(seed.category === "汤羹" ? "白胡椒" : "生抽", "1勺", "seasoning", 1, "勺"),
      ...pantry("盐", "食用油"),
    ],
    steps: [
      { title: "备好食材", description: `${mainNames}处理干净，按容易入口的大小切好，调料提前放在手边。` },
      { title: "开始烹饪", description: seed.category === "汤羹" ? "锅中加水煮开，放入主要食材，转小火煮至味道融合。" : "热锅放油，先处理耐熟食材，再加入其余食材快速翻炒。" },
      { title: "调味出锅", description: "加入调料翻匀，尝味后微调咸淡，趁热装盘。" },
    ],
    tips: [seed.tip ?? "食材下锅前尽量沥干水分，味道更香，也更安全。", "最后尝味再补盐，避免调味过重。"],
    videoUrl: `https://search.bilibili.com/all?keyword=${encodeURIComponent(seed.name + " 家常做法")}`,
    featured: seed.featured,
  };
});

export const dishCategories = ["全部", "快手菜", "荤菜", "素菜", "汤羹", "海鲜", "主食"] as const;

export const getDishBySlug = (slug: string) => dishes.find((dish) => dish.slug === slug);
