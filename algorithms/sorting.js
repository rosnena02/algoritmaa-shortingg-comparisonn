// Implementasi berbagai algoritma sorting

/**
 * Quick Sort - O(n log n) average, O(n²) worst case
 */
function quickSort(arr, compareFn, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, compareFn, left, right);
    quickSort(arr, compareFn, left, pivotIndex - 1);
    quickSort(arr, compareFn, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, compareFn, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (compareFn(arr[j], pivot) <= 0) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

/**
 * Heap Sort - O(n log n)
 */
function heapSort(arr, compareFn) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, compareFn, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, compareFn, i, 0);
  }
  
  return arr;
}

function heapify(arr, compareFn, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && compareFn(arr[left], arr[largest]) > 0) {
    largest = left;
  }
  
  if (right < n && compareFn(arr[right], arr[largest]) > 0) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, compareFn, n, largest);
  }
}

/**
 * Merge Sort - O(n log n)
 */
function mergeSort(arr, compareFn) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);
  
  return merge(left, right, compareFn);
}

function merge(left, right, compareFn) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

/**
 * Bubble Sort - O(n²)
 */
function bubbleSort(arr, compareFn) {
  const n = arr.length;
  const result = [...arr];
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (compareFn(result[j], result[j + 1]) > 0) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  
  return result;
}

/**
 * Fungsi perbandingan untuk sorting berdasarkan field tertentu
 */
function createCompareFn(sortBy = 'nik') {
  return function compare(a, b) {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'nik':
        aVal = a.nik;
        bVal = b.nik;
        break;
      case 'nama':
        aVal = a.nama.toLowerCase();
        bVal = b.nama.toLowerCase();
        break;
      case 'tanggal_lahir':
        aVal = new Date(a.tanggal_lahir);
        bVal = new Date(b.tanggal_lahir);
        break;
      default:
        aVal = a.nik;
        bVal = b.nik;
    }
    
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  };
}

/**
 * Wrapper function untuk sorting dengan pengukuran waktu
 */
function sortWithAlgorithm(data, algorithm, sortBy = 'nik') {
  const dataCopy = JSON.parse(JSON.stringify(data));
  const compareFn = createCompareFn(sortBy);
  const startTime = process.hrtime.bigint();
  
  let sortedData;
  
  switch (algorithm) {
    case 'quick':
      sortedData = quickSort(dataCopy, compareFn);
      break;
    case 'heap':
      sortedData = heapSort(dataCopy, compareFn);
      break;
    case 'merge':
      sortedData = mergeSort(dataCopy, compareFn);
      break;
    case 'bubble':
      sortedData = bubbleSort(dataCopy, compareFn);
      break;
    default:
      throw new Error(`Algoritma ${algorithm} tidak dikenali`);
  }
  
  const endTime = process.hrtime.bigint();
  const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
  
  return {
    sortedData,
    executionTime: executionTime.toFixed(3),
    dataCount: dataCopy.length
  };
}

module.exports = {
  quickSort,
  heapSort,
  mergeSort,
  bubbleSort,
  sortWithAlgorithm
};

