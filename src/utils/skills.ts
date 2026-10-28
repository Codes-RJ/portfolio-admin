import type { Skill, SkillCategoryGroup, SkillItem } from '../data/initialData';

export const skillLevel = (skill: SkillItem): number => skill.level ?? (typeof skill.proficiency === 'number' ? skill.proficiency : 0);
export const selectSkills = (groups: SkillCategoryGroup[], legacy: Skill[]) => groups.length
  ? groups.flatMap((group) => group.skills.map((skill, index) => ({ id: `${group.id}-${index}`, name: skill.name, level: skillLevel(skill), category: group.category || group.title })))
  : legacy;

export const dateValue = (value: string): number => {
  const parsed = Date.parse(/^\d{4}$/.test(value) ? `${value}-01-01` : value);
  return Number.isNaN(parsed) ? 0 : parsed;
};
