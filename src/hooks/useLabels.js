import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../components/Toast';
import {
  assignLabelToNote,
  createLabel as createLabelApi,
  deleteLabel as deleteLabelApi,
  getLabels,
  removeLabelFromNote,
  updateLabel as updateLabelApi,
} from '../services/labelService';
import { getErrorMessage } from '../utils/errors';

export function useLabels() {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadLabels = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLabels();
      setLabels(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to load labels.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadLabels();
  }, [loadLabels]);

  const addLabel = useCallback(
    async (name) => {
      try {
        const created = await createLabelApi(name.trim());
        setLabels((current) => [...current, created]);
        showToast('Label created');
        return created;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to create the label.'), 'error');
        return null;
      }
    },
    [showToast],
  );

  const renameLabel = useCallback(
    async (labelId, name) => {
      try {
        const updated = await updateLabelApi(labelId, name.trim());
        setLabels((current) =>
          current.map((label) => (label.id === updated.id ? updated : label)),
        );
        showToast('Label updated');
        return updated;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to update the label.'), 'error');
        return null;
      }
    },
    [showToast],
  );

  const removeLabel = useCallback(
    async (labelId) => {
      try {
        await deleteLabelApi(labelId);
        setLabels((current) => current.filter((label) => label.id !== labelId));
        showToast('Label deleted');
        return true;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to delete the label.'), 'error');
        return false;
      }
    },
    [showToast],
  );

  const assignLabel = useCallback(
    async (labelId, noteId) => {
      try {
        await assignLabelToNote(labelId, noteId);
        showToast('Label added to note');
        return true;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to add the label.'), 'error');
        return false;
      }
    },
    [showToast],
  );

  const unassignLabel = useCallback(
    async (labelId, noteId) => {
      try {
        await removeLabelFromNote(labelId, noteId);
        showToast('Label removed from note');
        return true;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to remove the label.'), 'error');
        return false;
      }
    },
    [showToast],
  );

  return {
    labels,
    loading: loading,
    loadLabels,
    addLabel,
    renameLabel,
    deleteLabel: removeLabel,
    assignLabel,
    unassignLabel,
  };
}
