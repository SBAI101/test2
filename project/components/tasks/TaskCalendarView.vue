<template>
  <div class="bg-white rounded-lg shadow p-6">
    <FullCalendar
      ref="calendar"
      :options="calendarOptions"
      class="task-calendar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps<{
  tasks: any[]
}>()

const emit = defineEmits<{
  edit: [task: any]
  delete: [task: any]
}>()

// Convert tasks to calendar events
const events = computed(() => {
  return props.tasks.map(task => {
    // Get colors based on priority
    const colors = {
      high: { background: '#FEE2E2', border: '#DC2626' },
      medium: { background: '#FEF3C7', border: '#D97706' },
      low: { background: '#D1FAE5', border: '#059669' }
    }

    const priority = task.priority || 'medium'
    const startDate = task.start_date || task.created_at
    const endDate = task.finished_date || task.due_date || task.start_date

    return {
      id: task.id,
      title: task.title,
      start: startDate,
      end: endDate,
      backgroundColor: colors[priority].background,
      borderColor: colors[priority].border,
      textColor: '#111827', // text-gray-900
      extendedProps: {
        description: task.description,
        priority: task.priority,
        status: task.status,
        task: task
      }
    }
  })
})

// Calendar configuration
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  editable: true,
  eventClick: handleEventClick,
  eventDidMount: handleEventMount,
  eventContent: renderEventContent,
  height: 'auto',
  contentHeight: 800
}))

// Handle clicking on an event
const handleEventClick = (info: any) => {
  const task = info.event.extendedProps.task
  emit('edit', task)
}

// Add custom styling and tooltips when events are mounted
const handleEventMount = (info: any) => {
  // Add opacity to the event background
  info.el.style.opacity = '0.9'
  
  // Add hover effect
  info.el.addEventListener('mouseenter', () => {
    info.el.style.opacity = '1'
    info.el.style.transform = 'scale(1.02)'
  })
  info.el.addEventListener('mouseleave', () => {
    info.el.style.opacity = '0.9'
    info.el.style.transform = 'scale(1)'
  })

  // Add tooltip with task details
  const tooltip = document.createElement('div')
  tooltip.className = 'task-tooltip'
  tooltip.innerHTML = `
    <div class="font-medium">${info.event.title}</div>
    <div class="text-sm text-gray-600">${info.event.extendedProps.description || 'No description'}</div>
    <div class="text-sm mt-1">
      <span class="font-medium">Status:</span> ${info.event.extendedProps.status}
      <br>
      <span class="font-medium">Priority:</span> ${info.event.extendedProps.priority}
    </div>
  `
  info.el.appendChild(tooltip)
}

// Custom event rendering
const renderEventContent = (eventInfo: any) => {
  return {
    html: `
      <div class="fc-event-main-frame">
        <div class="fc-event-title-container">
          <div class="fc-event-title fc-sticky">
            ${eventInfo.event.title}
            <div class="text-xs opacity-75">
              ${eventInfo.event.extendedProps.status}
            </div>
          </div>
        </div>
      </div>
    `
  }
}
</script>

<style>
.task-calendar .fc-event {
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-calendar .fc-event:hover .task-tooltip {
  display: block;
}

.task-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  min-width: 200px;
  margin-bottom: 0.5rem;
}

.task-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}
</style>