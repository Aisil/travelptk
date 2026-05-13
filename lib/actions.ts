/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

const translit = (str: string) => {
  const ru: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya'
  };
  return str.toLowerCase().split('').map(char => ru[char] || char).join('')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ── Категории ──

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return { error: "Name is required" };
  const slug = translit(name);
  try {
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category or slug already exists" };
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { id: 'desc' } });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryTree() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { children: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error: any) {
    console.error("Error fetching category tree:", error);
    throw new Error(error.message);
  }
}

// ── Метки ──

export async function getTags() {
  try {
    return await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// ── Контент (записи и страницы) ──

export async function createContent(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const contentType = (formData.get("contentType") as string) || "POST";
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const categoryIdRaw = formData.get("categoryId") as string;
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;
  const tagIds = formData.getAll("tagIds").map(id => parseInt(id as string, 10)).filter(id => !isNaN(id));

  if (!title || !slug || !content) {
    return { error: "Заполните обязательные поля" };
  }

  try {
    await prisma.entry.create({
      data: {
        title,
        slug,
        content,
        contentType: contentType as any,
        latitude: isNaN(latitude) ? null : latitude,
        longitude: isNaN(longitude) ? null : longitude,
        categoryId: categoryId && !isNaN(categoryId) ? categoryId : null,
        tags: {
          connect: tagIds.map(id => ({ id }))
        }
      }
    });
    revalidatePath("/admin/posts");
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (error) {
    console.error("Error creating content:", error);
    return { error: "Ошибка создания. Проверьте уникальность slug." };
  }
}

export async function getPosts() {
  try {
    return await prisma.entry.findMany({
      where: { contentType: "POST" },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPages() {
  try {
    return await prisma.entry.findMany({
      where: { contentType: "PAGE" },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

export async function getPublishedPosts() {
  try {
    return await prisma.entry.findMany({
      where: { status: "PUBLISHED", contentType: "POST" },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 12
    });
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }
}

export async function getAllPublishedPosts() {
  try {
    return await prisma.entry.findMany({
      where: { status: "PUBLISHED", contentType: "POST" },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching all published posts:", error);
    return [];
  }
}

export async function publishContent(id: number) {
  try {
    await prisma.entry.update({
      where: { id },
      data: { status: "PUBLISHED" }
    });
    revalidatePath("/admin/posts");
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (error) {
    console.error("Error publishing content:", error);
    return { error: "Failed to update status" };
  }
}

export async function getContentBySlug(slug: string) {
  try {
    return await prisma.entry.findUnique({
      where: { slug },
      include: { category: true, tags: true },
    });
  } catch (error) {
    console.error("Error fetching content by slug:", error);
    return null;
  }
}

// Обратная совместимость
export const getLocations = getPosts;
export const getPublishedLocations = getPublishedPosts;
export const getPublishedEntries = getPublishedPosts;
export const getAllPublishedLocations = getAllPublishedPosts;
export const getLocationBySlug = getContentBySlug;
export const createLocation = createContent;
export const publishLocation = publishContent;
