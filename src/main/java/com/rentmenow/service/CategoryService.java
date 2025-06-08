package com.rentmenow.service;

import com.rentmenow.entity.Category;
import com.rentmenow.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public Category createCategory(Category category) {
		if (categoryRepository.existsByName(category.getName())) {
			throw new RuntimeException("Category already exists");
		}
		return categoryRepository.save(category);
	}

	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	public Category getCategoryById(Long id) {
		return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
	}

	public Category updateCategory(Long id, Category categoryDetails) {
		Category category = getCategoryById(id);
		category.setName(categoryDetails.getName());
		category.setDescription(categoryDetails.getDescription());
		return categoryRepository.save(category);
	}

	public void deleteCategory(Long id) {
		if (!categoryRepository.existsById(id)) {
			throw new RuntimeException("Category not found");
		}
		categoryRepository.deleteById(id);
	}
}