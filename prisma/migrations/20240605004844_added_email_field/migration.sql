/*
  Warnings:

  - Added the required column `email` to the `ContactPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactPerson" ADD COLUMN     "email" TEXT NOT NULL;
