/**
 * reduce utility functions
 */

export const formatDate = (d: Date) => d.toLocaleDateString();
export const formatTime = (d: Date) => d.toLocaleTimeString();
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
