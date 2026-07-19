const Memory = require("../models/Memory");

// ==========================================
// Process Memory
// ==========================================

async function processMemory({
  user,
  extractionResult,
}) {
  try {
    // ----------------------------------
    // Nothing to Remember
    // ----------------------------------

    if (
      !extractionResult ||
      !extractionResult.shouldRemember
    ) {
      return null;
    }

    // ----------------------------------
    // Ignore
    // ----------------------------------

    if (extractionResult.action === "IGNORE") {
      return null;
    }

    // ----------------------------------
    // Create
    // ----------------------------------

    if (extractionResult.action === "CREATE") {
      return await saveMemory({
        user,
        title: extractionResult.title,
        memory: extractionResult.memory,
        category: extractionResult.category,
        importance: extractionResult.importance,
        source: "conversation",
      });
    }

    // ----------------------------------
    // Update
    // ----------------------------------

    if (extractionResult.action === "UPDATE") {
      return await updateMemory({
        user,
        title: extractionResult.title,
        memory: extractionResult.memory,
        category: extractionResult.category,
        importance: extractionResult.importance,
        source: "conversation",
      });
    }

    return null;

  } catch (error) {
    console.error("Process Memory Error:", error);
    return null;
  }
}

// ==========================================
// Save New Memory
// ==========================================

async function saveMemory({
  user,
  title,
  memory,
  category = "General",
  importance = 3,
  source = "conversation",
}) {
  try {
    const newMemory = await Memory.create({
      user,
      title,
      memory,
      category,
      importance,
      source,
    });

    return newMemory;

  } catch (error) {
    console.error("Save Memory Error:", error);
    return null;
  }
}

// ==========================================
// Update Existing Memory
// ==========================================

async function updateMemory({
  user,
  title,
  memory,
  category = "General",
  importance = 3,
  source = "conversation",
}) {
  try {

    const existingMemory = await Memory.findOne({
      user,
      title,
      isActive: true,
    });

    if (!existingMemory) {
      return await saveMemory({
        user,
        title,
        memory,
        category,
        importance,
        source,
      });
    }

    existingMemory.memory = memory;
    existingMemory.category = category;
    existingMemory.importance = importance;
    existingMemory.source = source;

    await existingMemory.save();

    return existingMemory;

  } catch (error) {
    console.error("Update Memory Error:", error);
    return null;
  }
}

// ==========================================
// Get Active Memories
// ==========================================

async function getMemories(user) {
  try {

    return await Memory.find({
      user,
      isActive: true,
    }).sort({
      importance: -1,
      updatedAt: -1,
    });

  } catch (error) {

    console.error("Get Memories Error:", error);

    return [];
  }
}

// ==========================================
// Archive Memory
// ==========================================

async function archiveMemory(memoryId) {
  try {

    return await Memory.findByIdAndUpdate(
      memoryId,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

  } catch (error) {

    console.error("Archive Memory Error:", error);

    return null;
  }
}

// ==========================================
// Delete Memory
// ==========================================

async function deleteMemory(memoryId) {
  try {

    return await Memory.findByIdAndDelete(memoryId);

  } catch (error) {

    console.error("Delete Memory Error:", error);

    return null;
  }
}

// ==========================================
// Get Memories By Category
// ==========================================

async function getMemoriesByCategory(
  user,
  category
) {
  try {

    return await Memory.find({
      user,
      category,
      isActive: true,
    }).sort({
      importance: -1,
      updatedAt: -1,
    });

  } catch (error) {

    console.error("Category Memory Error:", error);

    return [];
  }
}

// ==========================================
// Search Memories
// ==========================================

async function searchMemories(
  user,
  keyword
) {
  try {

    return await Memory.find({
      user,
      isActive: true,
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          memory: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

  } catch (error) {

    console.error("Search Memory Error:", error);

    return [];
  }
}

module.exports = {
  processMemory,
  saveMemory,
  updateMemory,
  getMemories,
  archiveMemory,
  deleteMemory,
 getMemoriesByCategory,
  searchMemories,
};