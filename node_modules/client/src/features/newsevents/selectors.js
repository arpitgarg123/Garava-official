// src/features/newsevents/selectors.js
import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectNewsEvents = (state) => state.newsevents;
export const selectNewsEventsItems = (state) => state.newsevents.items;
export const selectNewsEventsPagination = (state) => state.newsevents.pagination;
export const selectNewsEventsLoading = (state) => state.newsevents.loading;
export const selectNewsEventsError = (state) => state.newsevents.error;

// Current item selectors
export const selectCurrentNewsEvent = (state) => state.newsevents.currentItem;

// Events specific selectors
export const selectEventsGrouped = (state) => state.newsevents.eventsGrouped;
export const selectUpcomingEvents = createSelector(
  selectEventsGrouped,
  (grouped) => grouped?.upcoming || []
);
export const selectPastEvents = createSelector(
  selectEventsGrouped,
  (grouped) => grouped?.past || []
);

// Media coverage selectors
export const selectMediaCoverage = (state) => state.newsevents.mediaCoverage;
export const selectMediaCoverageItems = createSelector(
  selectMediaCoverage,
  (media) => media?.items || []
);

// Filter options selectors
export const selectFilterOptions = (state) => state.newsevents.filterOptions;

// Memoized selectors for better performance
export const selectPublishedNewsEvents = createSelector(
  selectNewsEventsItems,
  (items) => items.filter(item => item.status === 'published')
);

export const selectEventsByType = createSelector(
  [selectNewsEventsItems, (_, type) => type],
  (items, type) => items.filter(item => item.type === type)
);

export const selectNewsEventBySlug = createSelector(
  [selectNewsEventsItems, (_, slug) => slug],
  (items, slug) => items.find(item => item.slug === slug)
);