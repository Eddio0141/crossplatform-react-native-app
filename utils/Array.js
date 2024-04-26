function FilterIndex(array, index) {
  return array.filter((_, i) => i !== index);
}

export { FilterIndex };
