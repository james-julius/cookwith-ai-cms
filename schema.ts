// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  image,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Articles this User has authored
      //   more on that in the Article list below
      articles: relationship({ ref: 'Article.author', many: true }),

      recipes: relationship({ ref: 'Recipe.author', many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Recipe: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      images: image({ storage: 'local' }),
      description: document({ formatting: true }),
      nutritionalInformation: relationship({
        ref: 'NutritionalInformation.recipe',
        many: true,
      }),
      ingredients: relationship({ ref: 'Ingredient.recipe', many: true }),
      collections: relationship({ ref: 'Collection.recipes', many: true }),
      directions: document({ formatting: true }),
      author: relationship({ ref: 'User.recipes', many: false }),
    },
  }),
  Ingredient: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      quantity: text({ validation: { isRequired: true } }),
      unit: text({ validation: { isRequired: true } }),
      imperialQuantity: text({ validation: { isRequired: true } }),
      imperialUnit: text({ validation: { isRequired: true } }),
      recipe: relationship({ ref: 'Recipe.ingredients', many: false }),
    },
  }),
  NutritionalInformation: list({
    access: allowAll,
    ui: {
      label: 'Nutritional Information',
    },
    fields: {
      calories: text({ validation: { isRequired: true } }),
      carbohydrates: text({ validation: { isRequired: true } }),
      cholesterol: text({ validation: { isRequired: true } }),
      fat: text({ validation: { isRequired: true } }),
      protein: text({ validation: { isRequired: true } }),
      saturatedFat: text({ validation: { isRequired: true } }),
      sodium: text({ validation: { isRequired: true } }),
      sugars: text({ validation: { isRequired: true } }),
      totalFat: text({ validation: { isRequired: true } }),
      totalSaturatedFat: text({ validation: { isRequired: true } }),
      totalSodium: text({ validation: { isRequired: true } }),
      totalSugars: text({ validation: { isRequired: true } }),
      totalTransFat: text({ validation: { isRequired: true } }),
      recipe: relationship({
        ref: 'Recipe.nutritionalInformation',
        many: false,
      }),
    },
  }),
  Collection: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text({ validation: { isRequired: true } }),
      recipes: relationship({ ref: 'Recipe.collections', many: true }),
    },
  }),
  Article: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Article list
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // with this field, you can set a User as the author for an Article
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.articles',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // an Article can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Articles
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: 'Tag.articles',

        // an Article can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Articles associated with a Tag
      articles: relationship({ ref: 'Article.tags', many: true }),
    },
  }),
};
