"""Replace console.error/warn with logger in InvestaApp source files."""
import re
import sys
import os


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Skip the logger file itself
    if 'logger.ts' in filepath:
        return False
    
    # Add import for logger if not already present
    if "from '../utils/logger'" not in content and "from '../../utils/logger'" not in content and "from '../../../utils/logger'" not in content and "from '.../../../utils/logger'" not in content:
        # Determine relative path based on file location
        rel = os.path.relpath(filepath, 'src')
        depth = rel.count(os.sep)
        if depth == 1:
            # e.g., src/hooks/useAuthApi.ts
            import_path = '../utils/logger'
        elif depth == 2:
            # e.g., src/screens/main/HomeScreen.tsx
            import_path = '../../utils/logger'
        elif depth == 3:
            # e.g., src/screens/courses/utils/coursesApi.ts
            import_path = '../../../utils/logger'
        else:
            import_path = '../../utils/logger'
        
        # Add import after the last import statement
        lines = content.split('\n')
        last_import_idx = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import_idx = i
        
        if last_import_idx >= 0:
            lines.insert(last_import_idx + 1, f"import logger from '{import_path}';")
            content = '\n'.join(lines)
    
    # Replace console.error with logger.error
    content = re.sub(r'console\.error\(', 'logger.error(', content)
    # Replace console.warn with logger.warn
    content = re.sub(r'console\.warn\(', 'logger.warn(', content)
    # Replace console.log with logger.info (only in non-config files)
    if 'config.ts' not in filepath:
        content = re.sub(r'console\.log\(', 'logger.info(', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


if __name__ == '__main__':
    changed = 0
    for root, dirs, files in os.walk('src'):
        for fname in files:
            if fname.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, fname)
                if process_file(filepath):
                    print(f'Updated: {filepath}')
                    changed += 1
    print(f'\nTotal files updated: {changed}')
